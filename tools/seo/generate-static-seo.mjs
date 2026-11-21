import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Writes sitemap.xml and robots.txt into the prerendered output.
 *
 * Routes come from the build itself: every prerendered `index.html` is a page. Pages whose rendered
 * HTML has a `noindex` robots meta (for example the 404 page) are left out, so a new page only needs
 * its route; it never has to be added here by hand.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const outputDir = path.join(rootDir, 'dist/app/browser');

const company = await readJson('src/data/company/company.json');
const siteUrl = trimTrailingSlash(company.siteUrl || 'https://example.com');

const pages = await findPrerenderedPages(outputDir);
const routes = [];

for (const page of pages) {
	const html = await readFile(path.join(outputDir, page), 'utf8');

	if (!isNoIndex(html)) {
		const image = readMetaContent(html, 'og:image');
		const imageUrl = image ? new URL(image, `${siteUrl}/`) : null;
		routes.push({
			route: toRoute(page),
			image: imageUrl && /^https?:$/.test(imageUrl.protocol) ? imageUrl.href : undefined,
		});
	}
}

routes.sort((a, b) =>
	a.route === '/' ? -1 : b.route === '/' ? 1 : a.route.localeCompare(b.route),
);

await writeFile(path.join(outputDir, 'sitemap.xml'), buildSitemap(routes, siteUrl));
await writeFile(path.join(outputDir, 'robots.txt'), buildRobots(siteUrl));

console.log(`sitemap.xml: ${routes.length} route(s)`);

async function findPrerenderedPages(dir, relative = '') {
	const entries = await readdir(path.join(dir, relative), { withFileTypes: true });
	const pages = [];

	for (const entry of entries) {
		const entryPath = path.posix.join(relative, entry.name);

		if (entry.isDirectory()) {
			pages.push(...(await findPrerenderedPages(dir, entryPath)));
		} else if (entry.name === 'index.html') {
			pages.push(entryPath);
		}
	}

	return pages;
}

/** `index.html` -> `/`, `about/index.html` -> `/about/` (static hosts serve folders with a trailing slash). */
function toRoute(page) {
	const folder = path.posix.dirname(page);

	return folder === '.' ? '/' : `/${folder}/`;
}

function isNoIndex(html) {
	return /\bnoindex\b/i.test(readMetaContent(html, 'robots'));
}

/** Read generated head metadata regardless of attribute order; decode before XML escaping. */
function readMetaContent(html, name) {
	for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
		const attributes = Object.fromEntries(
			[...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map((match) => [
				match[1].toLowerCase(),
				match[3],
			]),
		);
		if (attributes.name !== name && attributes.property !== name) continue;
		return (attributes.content ?? '').replace(
			/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi,
			(entity, key) => {
				if (key.startsWith('#')) {
					const code =
						key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
					return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
				}
				return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[key.toLowerCase()] ?? entity;
			},
		);
	}
	return '';
}

function buildSitemap(routes, siteUrl) {
	const urls = routes
		.map(
			({ route, image }) => `	<url>
		<loc>${escapeXml(`${siteUrl}${route === '/' ? '' : route}`)}</loc>${image ? `\n\t\t<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>` : ''}
	</url>`,
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

function buildRobots(siteUrl) {
	return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

async function readJson(relativePath) {
	return JSON.parse(await readFile(path.join(rootDir, relativePath), 'utf8'));
}

function trimTrailingSlash(value) {
	return value.endsWith('/') ? value.slice(0, -1) : value;
}

function escapeXml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

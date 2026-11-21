import {
	AngularNodeAppEngine,
	createNodeRequestHandler,
	isMainModule,
	writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { basename, join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * With `outputHashing: "all"` Angular emits content-hashed bundles such as `main-Dk3_xQ9a.js`
 * or `chunk-BEJjL2E6.js`. The hash is 8 characters of letters, digits, `-` and `_` (older
 * builds used uppercase letters and digits only). Matching the bundle name prefix as well keeps
 * unhashed files such as `cookie-settings.js` out. Only hashed bundles are safe to cache forever;
 * everything else (prerendered HTML, assets copied from `src/assets`, sitemap, robots) must be
 * revalidated.
 */
const hashedFilePattern = /^(?:main|chunk|polyfills|styles|scripts)-[A-Za-z0-9_-]{8}\.(?:js|mjs|css)$/;

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');

app.use((_req, res, next) => {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
	next();
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
	express.static(browserDistFolder, {
		index: false,
		redirect: false,
		setHeaders: (res, filePath) => {
			res.setHeader(
				'Cache-Control',
				hashedFilePattern.test(basename(filePath))
					? 'public, max-age=31536000, immutable'
					: 'no-cache',
			);
		},
	}),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
	angularApp
		.handle(req)
		.then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
		.catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
	const port = process.env['PORT'] || 4000;
	app.listen(port, (error) => {
		if (error) {
			throw error;
		}

		console.log(`Node Express server listening on http://localhost:${port}`);
	});
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

# Benvora `www` redirect

The Worker redirects `https://www.benvora-grup.avyron.eu` to the canonical
`https://benvora-grup.avyron.eu`, retaining the path and query string.

The Cloudflare Workers Custom Domain creates the DNS record and a certificate
for this two-level hostname. A plain DNS record alone would not provide TLS
coverage under the zone's Universal SSL certificate.

Deploy from this directory with `npx wrangler deploy` after review. Verify the
custom domain reports Active, then check both `/` and a nested URL with a query
string over HTTPS. If the zone's broad `*.avyron.eu/*` Worker route intercepts
requests, add the more-specific `www.benvora-grup.avyron.eu/*` route with
Worker `None` so the Custom Domain can serve the redirect.

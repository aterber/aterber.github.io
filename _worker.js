export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const pathname = url.pathname;

		const staticFiles = [
			"list.txt",
			"favicon.ico",
			"4.5.0/sar.min.js"
		];

		if (staticFiles.includes(pathname.slice(1))) {
			return env.ASSETS.fetch(request);
		}

		const allowedFiles = [
			"google0e38760f4bbf9e6f.html",
			"GOOGLE1.html",
			"GOOGLE2.html",
			"GOOGLE3.html",
			"GOOGLE4.html",
			"GOOGLE5.html"
		];

		if (allowedFiles.includes(pathname.slice(1))) { // hapus leading '/'
			const fileRes = await fetch(`https://ndeworlde.github.io/${pathname.slice(1)}`);

			if (!fileRes.ok) {
				return new Response("Failed to load verification file", { status: 502 });
			}

			const html = await fileRes.text();

			return new Response(html, {
				status: 200,
				headers: {
					"Content-Type": "text/html; charset=UTF-8",
					"Cache-Control": "public, max-age=3600",
				},
			});
		}

		// 		if (pathname === "/robots.txt") {
		// 			return new Response(`User-agent: *
		// Disallow:

		// Sitemap: https://${url.hostname}/sitemapee.txt
		// Sitemap: https://${url.hostname}/sitemap-indexee.xml
		// `, {
		// 				headers: { "Content-Type": "text/plain" }
		// 			});
		// 		}
		
		if (pathname === "/") {
			const listReq = new Request(`${url.origin}/list.txt`);
			const listRes = await env.ASSETS.fetch(listReq);

			if (!listRes.ok) {
				return new Response("list.txt not found", { status: 404 });
			}

			let lines = (await listRes.text())
			.split("\n")
			.map(l => l.trim())
			.filter(l => l && !l.startsWith("#"));

			// ============================
			// Seed helper
			// ============================
			function seedStr(str) {
				let h = 0;
				for (let i = 0; i < str.length; i++) {
					h = (h * 31 + str.charCodeAt(i)) >>> 0;
				}
				return h;
			}

			function seeded(seed) {
				return () => {
					seed = Math.sin(seed) * 10000;
					return seed - Math.floor(seed);
				};
			}

			const domainSeed = seedStr(url.hostname);
			const rnd = seeded(domainSeed);

			function pick(arr, offset = 0) {
				return arr[(domainSeed + offset) % arr.length];
			}

			// ============================
			// Acak urutan link per domain
			// ============================
			for (let i = lines.length - 1; i > 0; i--) {
				const j = Math.floor(rnd() * (i + 1));
				[lines[i], lines[j]] = [lines[j], lines[i]];
			}

			// ============================
			// Random title / h1 / desc per domain
			// ============================
			const titleA = [
				"Top Shopping Picks",
				"Featured Product Resources",
				"Latest Shopping Guides",
				"Popular Online Selections",
				"Best Product Collections",
				"Trending Deal Resources",
				"Smart Shopping Directory",
				"Exclusive Product Picks",
				"Recommended Buying Guides",
				"Top Deal Listings"
			];

			const titleB = [
				"and Featured Resources",
				"for Smart Buyers",
				"Updated for Online Shoppers",
				"with Daily New Picks",
				"for Better Product Discovery",
				"with Trending Product Pages",
				"for Product Browsing",
				"with Selected Shopping Links",
				"for Shopping Inspiration",
				"with Curated Content"
			];

			const h1List = [
				"Featured Product Resources",
				"Latest Shopping Pages",
				"Popular Product Directories",
				"Top Product Discoveries",
				"Curated Shopping Resources",
				"Recommended Product Listings",
				"Updated Shopping Collections",
				"Daily Featured Product Pages",
				"Selected Online Product Links",
				"Smart Product Navigation"
			];

			const descList = [
				"Explore updated shopping guides, curated product pages, and categorized content resources.",
				"Browse selected shopping links, featured product collections, and fresh content updates.",
				"Discover organized product resources, daily shopping pages, and featured online selections.",
				"Access categorized shopping directories, updated product listings, and curated browsing pages.",
				"Find useful product pages, shopping content hubs, and featured online resources in one place.",
				"Browse curated shopping collections, product discovery pages, and updated online content links.",
				"Explore featured deal pages, organized shopping resources, and daily updated content directories.",
				"Navigate selected product listings, shopping guide pages, and categorized online resources.",
				"Access fresh shopping picks, curated product hubs, and updated content collections easily.",
				"Discover useful shopping resources, featured product pages, and categorized content selections."
			];

			const pageTitle = `${pick(titleA, 11)} ${pick(titleB, 17)}`;
			const pageH1 = pick(h1List, 23);
			const pageDesc = pick(descList, 31);

			// ============================
			// Label generator per domain
			// ============================
			const words1 = ["Best", "Top", "Hot", "Smart", "Latest", "Popular", "Featured", "Exclusive", "Recommended", "Trending"];
			const words2 = ["Product", "Shopping", "Deal", "Offer", "Item", "Collection", "Guide", "Choice", "Pick", "Selection"];
			const words3 = ["Today", "Online", "List", "Now", "Hub", "Zone", "Center", "World", "Spot", "Market"];
			const words4 = ["Update", "Review", "Finder", "Browse", "Discover", "Daily", "Store", "Choice", "Trend", "Special"];

			const linksHtml = lines.map((line, index) => {
				const safeLine = line
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;");

				const seed = seedStr(url.hostname + "|" + safeLine + "|" + index);

				const label = `${words1[seed % words1.length]} ${words2[Math.floor(seed / 7) % words2.length]} ${words3[Math.floor(seed / 13) % words3.length]} ${words4[Math.floor(seed / 17) % words4.length]} ${index + 1}`;

				return `<li><a href="/${safeLine}">${label}</a></li>`;
			}).join("\n");

			// ============================
			// HTML output
			// ============================
			const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<meta name="description" content="${pageDesc}">
<style>
body {
font-family: Arial, sans-serif;
background: #f9f9f9;
color: #222;
margin: 0;
padding: 30px;
}
.container {
max-width: 900px;
margin: auto;
background: #fff;
padding: 25px;
border-radius: 12px;
box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
h1 {
font-size: 28px;
margin-bottom: 10px;
line-height: 1.3;
}
p {
color: #666;
margin-bottom: 20px;
line-height: 1.7;
}
ul {
list-style: none;
padding: 0;
margin: 0;
}
li {
padding: 10px 0;
border-bottom: 1px solid #eee;
word-break: break-all;
}
a {
color: #0070f3;
text-decoration: none;
}
a:hover {
text-decoration: underline;
}
.count {
margin-bottom: 15px;
color: #666;
font-size: 14px;
}
.footer {
margin-top: 30px;
font-size: 13px;
color: #999;
}
</style>
</head>
<body>
<div class="container">
<h1>${pageH1}</h1>
<p>${pageDesc}</p>
<div class="count">Total: ${lines.length} links</div>
<ul>
${linksHtml}
</ul>
<div class="footer">
Updated resource listing for ${url.hostname}
</div>
</div>
</body>
</html>`;

			return new Response(html, {
				status: 200,
				headers: {
					"Content-Type": "text/html; charset=UTF-8",
					"Cache-Control": "public, max-age=3600"
				}
			});
		}
		
		if (pathname === "/robots.txt") {

			const sitemaps = [
				// "ar-sitemap/sitemap-000.txt.gz",
				// "ar-sitemap/sitemap-001.txt.gz",
				// "ar-sitemap/sitemap-002.txt.gz",
				// "ar-sitemap/sitemap-003.txt.gz",
				// "ar-sitemap/sitemap-004.txt.gz",
				// "ar-sitemap/sitemap-005.txt.gz",
				// "ar-sitemap/sitemap-006.txt.gz",
				// "ar-sitemap/sitemap-007.txt.gz",
				// "ar-sitemap/sitemap-008.txt.gz",
				// "ar-sitemap/sitemap-009.txt.gz",
				// "ar-sitemap/sitemap-010.txt.gz",
				// "ar-sitemap/sitemap-011.txt.gz"
			];

			const sitemapLines = sitemaps
			.map(s => `Sitemap: https://${url.hostname}/${s}`)
			.join("\n");

			return new Response(
				`User-agent: *
Disallow:

${sitemapLines}
`, {
	headers: { "Content-Type": "text/plain" }
});
		}
		
		if (pathname.startsWith("/sitemap-indexee")) {
			const match = pathname.match(/^\/sitemap-indexee(?:-([a-z]{2}))?\.xml$/);
			const lang = match?.[1] || "";

			const listReq = new Request(`${url.origin}/list.txt`);
			const listRes = await env.ASSETS.fetch(listReq);
			if (!listRes.ok) return new Response("list.txt not found", { status: 404 });

		let lines = (await listRes.text())
		.split("\n")
		.map(l => l.trim())
		.filter(l => l && !l.startsWith("#"));

		if (lang) lines = lines.filter(l => l.startsWith(`${lang}-sitemap/`));

		// Seeded random (agar tiap subdomain urutannya beda)
		function seedStr(str) {
			let h = 0;
			for (let c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
			return h;
		}
		function seeded(seed) {
			return () => {
				seed = Math.sin(seed) * 10000;
				return seed - Math.floor(seed);
			};
		}
		const rnd = seeded(seedStr(url.hostname));
		for (let i = lines.length - 1; i > 0; i--) {
			const j = Math.floor(rnd() * (i + 1));
			[lines[i], lines[j]] = [lines[j], lines[i]];
		}

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.map(l => `<sitemap><loc>https://${url.hostname}/${l}</loc></sitemap>`).join("\n")}
</sitemapindex>`;

		return new Response(xml, { headers: { "Content-Type": "application/xml" } });
	}

	// ============================
	// 4. sitemap.txt / sitemap-xx.txt
	// ============================
	if (pathname.startsWith("/sitemapee")) {
	const match = pathname.match(/^\/sitemapee(?:-([a-z]{2}))?\.txt$/);
	const lang = match?.[1] || "";

	const listReq = new Request(`${url.origin}/list.txt`);
const listRes = await env.ASSETS.fetch(listReq);

if (!listRes.ok) return new Response("list.txt not found", { status: 404 });

let lines = (await listRes.text())
.split("\n")
.map(l => l.trim())
.filter(l => l && !l.startsWith("#"));

if (lang) lines = lines.filter(l => l.startsWith(`${lang}-sitemap/`));

// Seed urutan
function seedStr(str) {
let h = 0;
for (let c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
return h;
}
function seeded(seed) {
return () => {
seed = Math.sin(seed) * 10000;
return seed - Math.floor(seed);
};
}
const rnd = seeded(seedStr(url.hostname));
for (let i = lines.length - 1; i > 0; i--) {
const j = Math.floor(rnd() * (i + 1));
[lines[i], lines[j]] = [lines[j], lines[i]];
}

return new Response(
lines.map(l => `https://${url.hostname}/${l}`).join("\n") + "\n",
{ headers: { "Content-Type": "text/plain" } }
);
}

// ============================
// 5. Serve real sitemap gz files
// ============================
if (/^\/[a-z]{2}\/.+$/.test(pathname)) {
	return env.ASSETS.fetch(request);
}

// ============================
// 6. Semua selain sitemap → 404
// ============================
return new Response("404 Not Found", { status: 404 });
}
};

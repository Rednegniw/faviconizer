<!-- SEO Component for managing all metadata -->
<script lang="ts">
	const title = "Faviconizer - Convert your image to a favicon";
	const description = "Free online tool to convert any image into a favicon. Supports square and non-square images with a built-in cropping tool. Generate favicons in multiple sizes for your website without any hassle.";
	const url = "https://faviconizer.com";
	const previewImage = `${url}/preview.jpg`;
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content="Antonín Wingender" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={previewImage} />
	<meta property="og:site_name" content="Faviconizer" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={previewImage} />

	<!-- JSON-LD Structured Data -->
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Faviconizer",
			"url": url,
			"description": description,
			"applicationCategory": "DesignApplication",
			"operatingSystem": "Any",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"featureList": [
				"Convert images to favicons",
				"Built-in image cropping",
				"Multiple favicon sizes",
				"Free to use"
			]
		})}
	</script>
</svelte:head> 
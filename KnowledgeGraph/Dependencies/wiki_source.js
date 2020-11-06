const wiki = require('wikijs').default;

exports.wikiSearch = function wikiSearch(title) {
	title = title.replace(/_/g, ' ')
	let apiUrl = 'https://en.wikipedia.org/w/api.php';
	if (title.includes("wikipedia.org")) {
		let domain;
		[domain, title] = title.split("/wiki/");
		if (!domain.match(/https:\/\/[^.]+\.wikipedia\.org/).length) {
			console.log("Bad URL");
			return Promise.reject();
		}
		apiUrl = domain + "/w/api.php";
	}

	const ignoreContent = [
		"See also",
		"Notes",
		"Bibliography",
		"Selected bibliography",
		"Further reading",
		"References",
		"External links"
	];

	return wiki({apiUrl: apiUrl})
		.page(title)
		.then(page => Promise.all([page.summary(), page.content()])
			.then(([summary, contentArray]) => 
				[summary, contentArray
					.filter(content => !ignoreContent.includes(content.title))
					.map(content => content.content)
					.reduce((corpus, content) => [corpus, content].join(' '), "")
				].join(' ')
			)
		);
}
export async function fetchTranslations(word) {
	try {
		const response = await fetch(`http://127.0.0.1:5000/translations/${word}`);
		if (response.ok) {
			const translations = await response.json();
			console.log(translations);
			return translations;
		} else {
			console.error('Error fetching translations');
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
	return [];
}
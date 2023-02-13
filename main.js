const form = document.querySelector("#pdf-form");
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(form);

	let data = {}

	formData.forEach((value, key) => {
	data[key] = value;
	});

	const imageFile = formData.get("image");
	const reader = new FileReader();

	reader.readAsDataURL(imageFile);


	reader.addEventListener("load", () => {
		data.image = reader.result;

		const pdf = new jsPDF();

		pdf.setFont(data.font);
		pdf.setFontType(data.style_czcionki);
		pdf.setFontSize(data.fontSizeHeader);
		pdf.setTextColor(data.header_color);

		let splitTitle = pdf.splitTextToSize(data.title, 180);
		pdf.text(105, 20, splitTitle, {
			align: 'center'
		});

		// pdf.text(data.title, 105, 30, 'center');

		pdf.setTextColor(data.font_color);
		pdf.setFontSize(data.fontSize);


		if(data.image === 'data:' || data.image === 'data:application/octet-stream;base64,')
		{
			split_text(pdf, data.message, 180, data, 40);
			
		} else {
			pdf.addImage(data.image, 'JPEG', 15, 40, 180, 120);

			split_text(pdf, data.message, 180, data, 170);
		}
		
		addFooters(pdf);
		pdf.setFontSize(8);
		pdf.setTextColor(data.header_color);

		const footerAuthor = data.date + "  " + data.author;

		pdf.text(footerAuthor, 15, 292, {
			align: 'left'
		});

		pdf.text("Tel. " + data.phone, 200, 287, {
			align: 'right'
		});

		pdf.text("Email: " + data.email, 200, 292, {
			align: 'right'
		});
		
		pdf.save(data.title + '.pdf');
	});

});

const addFooters = pdf => {
	const pageCount = pdf.internal.getNumberOfPages()
 
	pdf.setFont('helvetica', 'italic')
	pdf.setFontSize(8)
	for (var i = 1; i <= pageCount; i++) {
		pdf.setPage(i)
		pdf.text('Page ' + String(i) + ' of ' + String(pageCount), pdf.internal.pageSize.width / 2, 287, {
		 align: 'center'
	  })
	}
 }

function split_text(pdf, text, size, data, positionY) {
	const pageHeight = pdf.internal.pageSize.height;

	const wrappedText = pdf.splitTextToSize(text, size);
	let iterations = 1;
	const defaultYjump = data.opacity / 10;

	wrappedText.forEach((line) => {
		const pageCount = pdf.internal.getNumberOfPages()
		if (pageCount === 1) {
			var posY = positionY + defaultYjump * iterations++;
		} else {
			var posY = 20 + defaultYjump * iterations++;
		}
		if (posY > pageHeight - 20) {
			pdf.addPage();
			iterations = 1;
			posY = 20 + defaultYjump * iterations++;
		}
		pdf.text(15, posY, line, {
			align: 'justify'
		 });
	});
}
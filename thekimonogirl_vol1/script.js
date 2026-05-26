pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const pdfUrl = './book.pdf';

const book = document.getElementById('book');

book.innerHTML = `
  <div style="
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    font-size:20px;
  ">
    Loading PDF...
  </div>
`;

async function renderPDF() {

  try {

    console.log('PDF loading start');

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    console.log('PDF loaded');

    const totalPages = pdf.numPages;

    console.log('Total pages:', totalPages);

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {

      console.log('Rendering page:', i);

      const page = await pdf.getPage(i);

      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');

      const context = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      pages.push(canvas.toDataURL('image/jpeg', 0.9));
    }

    console.log('All pages rendered');

    book.innerHTML = '';

    pages.forEach(src => {

      const div = document.createElement('div');

      div.className = 'page';

      div.innerHTML = `
        <img src="${src}" style="width:100%;">
      `;

      book.appendChild(div);
    });

    console.log('HTML added');

  } catch (error) {

    console.error(error);

    book.innerHTML = `
      <div style="
        color:red;
        padding:40px;
        font-size:18px;
      ">
        ERROR:<br><br>
        ${error.message}
      </div>
    `;
  }
}

renderPDF();

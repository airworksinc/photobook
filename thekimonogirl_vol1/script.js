pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const pdfUrl = './pdf/book.pdf';

const isMobile = window.innerWidth < 768;

async function renderPDF() {

  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

  const totalPages = pdf.numPages;

  const pages = [];

  // PDFを画像化
  for (let i = 1; i <= totalPages; i++) {

    const page = await pdf.getPage(i);

    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    pages.push(canvas.toDataURL('image/jpeg', 0.95));
  }

  const book = document.getElementById('book');

  // スマホ
  if (isMobile) {

    pages.forEach(src => {

      const div = document.createElement('div');
      div.className = 'page';

      div.innerHTML = `<img src="${src}">`;

      book.appendChild(div);
    });

  } else {

    // 表紙
    addSinglePage(book, pages[0]);

    // 見開き
    for (let i = 1; i < pages.length - 1; i += 2) {

      const spread = document.createElement('div');

      spread.className = 'page';

      spread.innerHTML = `
        <div style="display:flex;width:100%;height:100%;">
          <img src="${pages[i]}" style="width:50%;">
          <img src="${pages[i+1]}" style="width:50%;">
        </div>
      `;

      book.appendChild(spread);
    }

    // 裏表紙
    addSinglePage(book, pages[pages.length - 1]);
  }

  new St.PageFlip(book, {
    width: 1000,
    height: 1400,
    size: "stretch",
    minWidth: 315,
    maxWidth: 2000,
    minHeight: 400,
    maxHeight: 3000,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false
  }).loadFromHTML(document.querySelectorAll('.page'));
}

function addSinglePage(book, src) {

  const div = document.createElement('div');

  div.className = 'page';

  div.innerHTML = `<img src="${src}">`;

  book.appendChild(div);
}

renderPDF();

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const pdfUrl = './book.pdf';

const isMobile = window.innerWidth < 768;

async function renderPDF() {

  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

  const totalPages = pdf.numPages;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {

    const page = await pdf.getPage(i);

    const viewport = page.getViewport({
      scale: isMobile ? 1.5 : 2
    });

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    pages.push(canvas.toDataURL('image/jpeg', 0.92));
  }

  const book = document.getElementById('book');

  // ===== スマホ =====
  if (isMobile) {

    pages.forEach(src => {
      addSinglePage(book, src);
    });

  } else {

    // 表紙
    addSinglePage(book, pages[0]);

    // 中面見開き
    for (let i = 1; i < pages.length - 1; i += 2) {

      const spread = document.createElement('div');

      spread.className = 'page';

      spread.innerHTML = `
        <div class="spread">
          <img src="${pages[i]}">
          <img src="${pages[i + 1]}">
        </div>
      `;

      book.appendChild(spread);
    }

    // 裏表紙
    addSinglePage(book, pages[pages.length - 1]);
  }

  const pageFlip = new St.PageFlip(book, {
    width: 1000,
    height: 1414,
    size: "stretch",

    minWidth: 315,
    maxWidth: 2000,

    minHeight: 400,
    maxHeight: 3000,

    maxShadowOpacity: 0.4,

    showCover: true,

    mobileScrollSupport: false,

    usePortrait: true
  });

  pageFlip.loadFromHTML(
    document.querySelectorAll('.page')
  );
}

function addSinglePage(book, src) {

  const div = document.createElement('div');

  div.className = 'page';

  div.innerHTML = `
    <div class="single">
      <img src="${src}">
    </div>
  `;

  book.appendChild(div);
}

renderPDF();

import { useEffect, useState } from 'react'
import { ProductCard } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import type { Product, ProductApiResponse } from './types/product'

const PRODUCT_SOURCES = [
  '/api/produtos.json',
  'https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json',
  '/produtos.json',
]

const topInfos = [
  'Compra 100% segura',
  'Frete gratis acima de R$ 200',
  'Parcele suas compras',
]

const navItems = [
  'TODAS CATEGORIAS',
  'SUPERMERCADO',
  'LIVROS',
  'MODA',
  'LANCAMENTOS',
  'OFERTAS DO DIA',
  'ASSINATURA',
]

const shortcutItems = [
  'Tecnologia',
  'Supermercado',
  'Bebidas',
  'Ferramentas',
  'Saude',
  'Esportes e Fitness',
  'Moda',
]

const tabItems = ['CELULAR', 'ACESSORIOS', 'TABLETS', 'NOTEBOOKS', 'TVS', 'VER TODOS']

function getShowcaseRows(products: Product[]): Product[][] {
  if (products.length === 0) {
    return []
  }

  const extended = [...products, ...products, ...products]
  return [extended.slice(0, 4), extended.slice(4, 8), extended.slice(8, 12)]
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const showcaseRows = getShowcaseRows(products)

  useEffect(() => {
    const controller = new AbortController()

    function isValidResponse(data: ProductApiResponse) {
      return data.success && Array.isArray(data.products)
    }

    async function fetchProductsFromAnySource() {
      for (const source of PRODUCT_SOURCES) {
        try {
          const response = await fetch(source, { signal: controller.signal })
          if (!response.ok) {
            continue
          }

          const data: ProductApiResponse = await response.json()
          if (isValidResponse(data)) {
            return data.products
          }
        } catch (error) {
          if ((error as Error).name === 'AbortError') {
            throw error
          }
        }
      }

      throw new Error('Nenhuma fonte de produtos retornou dados válidos.')
    }

    async function loadProducts() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const items = await fetchProductsFromAnySource()
        setProducts(items)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setErrorMessage('Não foi possível carregar a vitrine no momento.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [])

  return (
    <div className="site-shell">
      <div className="top-strip">
        {topInfos.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>

      <header className="main-header">
        <a className="brand" href="#" aria-label="Econverse">
          <span>eco</span>nverse
        </a>
        <label className="search" aria-label="Campo de busca">
          <input type="search" placeholder="o que voce esta buscando?" />
        </label>
        <div className="header-actions" aria-hidden="true">
          <span>i</span>
          <span>c</span>
          <span>o</span>
          <span>n</span>
        </div>
      </header>

      <nav className="departments" aria-label="Categorias principais">
        {navItems.map((item) => (
          <a key={item} href="#" className={item === 'OFERTAS DO DIA' ? 'is-active' : ''}>
            {item}
          </a>
        ))}
      </nav>

      <section className="hero" aria-label="Banner principal">
        <div>
          <h1>Venha conhecer nossas promocoes</h1>
          <p>
            <strong>50% Off</strong> nos produtos
          </p>
          <button type="button">Ver produto</button>
        </div>
      </section>

      <main className="page">
        <section className="shortcuts" aria-label="Atalhos de categorias">
          {shortcutItems.map((item, index) => (
            <article key={item} className={index === 0 ? 'is-highlighted' : ''}>
              <div className="shortcut-icon" aria-hidden="true">
                <span></span>
              </div>
              <p>{item}</p>
            </article>
          ))}
        </section>

        {isLoading && <p className="status">Carregando produtos...</p>}
        {!isLoading && errorMessage && <p className="status">{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <>
            {showcaseRows.map((row, rowIndex) => (
              <section
                key={`showcase-${rowIndex}`}
                className="showcase"
                aria-label="Produtos relacionados"
              >
                <header className="section-title">
                  <h2>Produtos relacionados</h2>
                  {rowIndex > 0 && <a href="#">Ver todos</a>}
                </header>

                {rowIndex === 0 && (
                  <div className="tabs" role="tablist" aria-label="Filtros de categoria">
                    {tabItems.map((item, index) => (
                      <button type="button" role="tab" key={item} aria-selected={index === 0}>
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                <div className="carousel-row" aria-label="Lista de produtos">
                  <button type="button" className="arrow arrow-left" aria-label="Voltar">
                    {'<'}
                  </button>

                  <ul className="product-grid">
                    {row.map((product, index) => (
                      <li key={`${product.productName}-${product.price}-${rowIndex}-${index}`}>
                        <ProductCard product={product} onOpenDetails={setSelectedProduct} />
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="arrow arrow-right"
                    aria-label="Avancar"
                  >
                    {'>'}
                  </button>
                </div>

                {rowIndex !== 2 && (
                  <section className="partners" aria-label="Parceiros">
                    {[1, 2].map((partner) => (
                      <article key={partner}>
                        <h3>Parceiros</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur</p>
                        <button type="button">CONFIRA</button>
                      </article>
                    ))}
                  </section>
                )}

                {rowIndex === 1 && (
                  <section className="brands" aria-label="Navegue por marcas">
                    <h2>Navegue por marcas</h2>
                    <div className="brand-list">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <article key={`brand-${index}`}>
                          <span>eco</span>nverse
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </section>
            ))}
          </>
        )}
      </main>

      <section className="newsletter" aria-label="Newsletter">
        <div>
          <h2>Inscreva-se na nossa newsletter</h2>
          <p>Assine e receba conteudos exclusivos da Econverse.</p>
        </div>

        <form>
          <input type="text" placeholder="Digite seu nome" />
          <input type="email" placeholder="Digite seu e-mail" />
          <button type="submit">INSCREVER</button>
          <label>
            <input type="checkbox" /> Aceito os termos e condicoes
          </label>
        </form>
      </section>

      <footer className="site-footer">
        <section>
          <a className="brand" href="#">
            <span>eco</span>nverse
          </a>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </section>

        <section>
          <h3>Institucional</h3>
          <a href="#">Sobre nos</a>
          <a href="#">Movimento</a>
          <a href="#">Trabalhe conosco</a>
        </section>

        <section>
          <h3>Ajuda</h3>
          <a href="#">Suporte</a>
          <a href="#">Fale conosco</a>
          <a href="#">Perguntas frequentes</a>
        </section>

        <section>
          <h3>Termos</h3>
          <a href="#">Termos e condicoes</a>
          <a href="#">Politica de privacidade</a>
          <a href="#">Troca e devolucao</a>
        </section>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

export default App

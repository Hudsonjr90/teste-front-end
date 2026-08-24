import { useEffect, useState } from 'react'
import { ProductCard } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import type { Product, ProductApiResponse } from './types/product'
import header from './assets/icons/header.svg'
import searchIcon from './assets/icons/search.svg'
import someIcon from './assets/icons/some.svg'
import tecIcon from './assets/icons/tec.svg'
import mktIcon from './assets/icons/mkt.svg'
import drkIcon from './assets/icons/drk.svg'
import tooIcon from './assets/icons/too.svg'
import heaIcon from './assets/icons/hea.svg'
import fitIcon from './assets/icons/fit.svg'
import modIcon from './assets/icons/mod.svg'
import social from './assets/icons/social.svg'

const PRODUCT_SOURCES = [
  '/api/produtos.json',
  'https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json',
  '/produtos.json',
]

const navItems = [
  { label: 'TODAS CATEGORIAS', href: '#categorias' },
  { label: 'SUPERMERCADO', href: '#produtos' },
  { label: 'LIVROS', href: '#produtos' },
  { label: 'MODA', href: '#produtos' },
  { label: 'LANCAMENTOS', href: '#produtos' },
  { label: 'OFERTAS DO DIA', href: '#produtos' },
  { label: 'ASSINATURA', href: '#newsletter' },
]

const shortcutItems = [
  { label: 'Tecnologia', icon: tecIcon },
  { label: 'Supermercado', icon: mktIcon },
  { label: 'Bebidas', icon: drkIcon },
  { label: 'Ferramentas', icon: tooIcon },
  { label: 'Saude', icon: heaIcon },
  { label: 'Esportes e Fitness', icon: fitIcon },
  { label: 'Moda', icon: modIcon },
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
      <img className="header-icon" src={header} alt="" aria-hidden="true" />

      <header className="main-header">
        <a className="brand" href="/" aria-label="Econverse">
          <span>eco</span>nverse
        </a>
        <label className="search" htmlFor="search-input">
          <img className="search__icon" src={searchIcon} alt="" aria-hidden="true" />
          <input
            id="search-input"
            name="q"
            type="search"
            placeholder="o que voce esta buscando?"
            aria-label="Pesquisar produtos"
          />
        </label>
        <div className="header-actions" aria-hidden="true">
          <img src={someIcon} alt="" />
        </div>
      </header>

      <nav className="departments" aria-label="Categorias principais">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={item.label === 'OFERTAS DO DIA' ? 'is-active' : ''}
          >
            {item.label}
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
        <section id="categorias" className="shortcuts" aria-label="Atalhos de categorias">
          {shortcutItems.map((item, index) => (
            <article key={item.label} className={index === 0 ? 'is-highlighted' : ''}>
              <div className="shortcut-icon" aria-hidden="true">
                <img src={item.icon} alt="" />
              </div>
              <p>{item.label}</p>
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
                id={rowIndex === 0 ? 'produtos' : undefined}
                className="showcase"
                aria-label="Produtos relacionados"
              >
                <header className="section-title">
                  <h2>Produtos relacionados</h2>
                  {rowIndex > 0 && <a href="#produtos">Ver todos</a>}
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

      <section id="newsletter" className="newsletter" aria-label="Newsletter">
        <div className="newsletter__content">
          <h2>Inscreva-se na nossa newsletter</h2>
          <p>Assine a nossa newsletter e receba as novidades e conteudos exclusivos da Econverse.</p>
        </div>

        <form className="newsletter__form" aria-label="Formulario de newsletter">
          <label className="sr-only" htmlFor="newsletter-name">
            Digite seu nome
          </label>
          <input id="newsletter-name" name="name" type="text" placeholder="Digite seu nome" />
          <label className="sr-only" htmlFor="newsletter-email">
            Digite seu e-mail
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
          />
          <button type="submit">INSCREVER</button>
          <label htmlFor="newsletter-terms">
            <input id="newsletter-terms" name="terms" type="checkbox" /> Aceito os termos e condicoes
          </label>
        </form>
      </section>

      <footer className="site-footer">
        <section className="site-footer__brand">
          <a className="brand" href="/" aria-label="Econverse">
            <span>eco</span>nverse
          </a>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className="site-footer__social" aria-label="Redes sociais">
            <img src={social} alt="Redes sociais" />
          </div>
        </section>

        <section>
          <h3>Institucional</h3>
          <a href="/sobre">Sobre nos</a>
          <a href="/movimento">Movimento</a>
          <a href="/trabalhe-conosco">Trabalhe conosco</a>
        </section>

        <section>
          <h3>Ajuda</h3>
          <a href="/suporte">Suporte</a>
          <a href="/fale-conosco">Fale conosco</a>
          <a href="/perguntas-frequentes">Perguntas frequentes</a>
        </section>

        <section>
          <h3>Termos</h3>
          <a href="/termos-e-condicoes">Termos e condicoes</a>
          <a href="/politica-de-privacidade">Politica de privacidade</a>
          <a href="/troca-e-devolucao">Troca e devolucao</a>
        </section>
      </footer>

      <p className="footer-note">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

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

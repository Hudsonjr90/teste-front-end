import { useEffect } from 'react'
import type { Product } from '../types/product'

type ProductModalProps = {
  product: Product
  onClose: () => void
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const installmentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

export function ProductModal({ product, onClose }: ProductModalProps) {
  const installmentValue = product.price / 10

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={onClose}
      aria-hidden="true"
    >
      <article
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          x
        </button>

        <img className="modal__image" src={product.photo} alt={product.productName} />

        <div className="modal__content">
          <h2 id="modal-title" className="modal__title">
            {product.productName}
          </h2>
          <p className="modal__price">{priceFormatter.format(product.price)}</p>
          <p className="modal__description">
            Muitos produtos de tecnologia com condicoes especiais para voce.
          </p>
          <a className="modal__details" href="#">
            Veja mais detalhes do produto &gt;
          </a>

          <div className="modal__actions">
            <div className="modal__quantity" aria-label="Quantidade">
              <button type="button" aria-label="Diminuir quantidade">
                -
              </button>
              <span>01</span>
              <button type="button" aria-label="Aumentar quantidade">
                +
              </button>
            </div>

            <button type="button" className="modal__buy">
              COMPRAR
            </button>
          </div>

          <p className="modal__installments">
            ou 10x de {installmentFormatter.format(installmentValue)} sem juros
          </p>
        </div>
      </article>
    </div>
  )
}

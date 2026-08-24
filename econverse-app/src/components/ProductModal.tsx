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

export function ProductModal({ product, onClose }: ProductModalProps) {
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
          <p className="modal__description">{product.descriptionShort}</p>
          <p className="modal__price">{priceFormatter.format(product.price)}</p>
          <button type="button" className="modal__buy">
            Finalizar compra
          </button>
        </div>
      </article>
    </div>
  )
}

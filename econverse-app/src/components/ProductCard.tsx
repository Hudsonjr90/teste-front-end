import type { Product } from '../types/product'

type ProductCardProps = {
  product: Product
  onOpenDetails: (product: Product) => void
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const oldPrice = product.price * 1.03

  return (
    <article className="product-card" onClick={() => onOpenDetails(product)}>
      <img
        className="product-card__image"
        src={product.photo}
        alt={product.productName}
        loading="lazy"
      />
      <div className="product-card__body">
        <p className="product-card__description">{product.descriptionShort}</p>
        <p className="product-card__old-price">{priceFormatter.format(oldPrice)}</p>
        <p className="product-card__price">{priceFormatter.format(product.price)}</p>
        <p className="product-card__installments">ou 2x de R$ 49,95 sem juros</p>
        <p className="product-card__shipping">Frete gratis</p>
        <button
          type="button"
          className="product-card__button"
          onClick={() => onOpenDetails(product)}
          aria-label={`Ver detalhes de ${product.productName}`}
        >
          COMPRAR
        </button>
      </div>
    </article>
  )
}

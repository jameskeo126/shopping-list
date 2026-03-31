import { IconPlus } from '@tabler/icons-react'

export default function ShopSelector({ shops, selectedShopId, onSelect, onAddShop }) {
  if (shops.length === 0) {
    return (
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--grey-mid)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ color: 'var(--grey-text)', fontSize: '14px' }}>
          No shops yet —
        </span>
        <button
          onClick={onAddShop}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--black)', fontSize: '14px', fontWeight: 600, padding: 0,
            fontFamily: 'var(--font-body)',
          }}
        >
          Add a shop
        </button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '12px 16px',
      overflowX: 'auto',
      borderBottom: '1px solid var(--grey-mid)',
      scrollbarWidth: 'none',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      background: 'var(--white)',
      zIndex: 100,
    }}>
      {shops.map(shop => {
        const active = shop.id === selectedShopId
        return (
          <button
            key={shop.id}
            onClick={() => onSelect(shop.id)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: active ? 'none' : '1px solid var(--grey-mid)',
              background: active ? 'var(--black)' : 'transparent',
              color: active ? 'var(--white)' : 'var(--grey-text)',
              fontWeight: active ? 600 : 400,
              fontSize: '14px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              flexShrink: 0,
              fontFamily: 'var(--font-body)',
            }}
          >
            {shop.name}
          </button>
        )
      })}
      <button
        aria-label="Add shop"
        onClick={onAddShop}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '1px dashed var(--grey-mid)',
          background: 'transparent',
          color: 'var(--grey-icon)',
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconPlus size={15} stroke={1.5} />
      </button>
    </div>
  )
}

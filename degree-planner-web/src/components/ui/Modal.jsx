export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4" onClick={onClose}>
      <div className="w-full max-w-md border border-line bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <h4 className="mb-4 font-display text-xl font-bold">{title}</h4>
        {children}
      </div>
    </div>
  )
}

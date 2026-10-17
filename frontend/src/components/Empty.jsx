const Empty = ({ title, text, action }) => (
  <div className="grid place-items-center border border-dashed border-white/15 px-6 py-24 text-center">
    <div>
      <p className="font-display text-4xl sm:text-5xl">{title}</p>
      {text && <p className="mx-auto mt-3 max-w-sm text-sm text-mute">{text}</p>}
      {action}
    </div>
  </div>
);

export default Empty;

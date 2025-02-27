export const TagPill = ({ text }) => {
  return (
    <div
      className="p-2 text-black font-semibold bg-white rounded-full text-xs font-lato"
      key={text}
    >
      {text}
    </div>
  );
};

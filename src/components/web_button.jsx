function webbutton({ text, onClick, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-gradient-to-tl cursor-pointer from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white font-family-inter font-medium text-[14px] sm:text-[16px] w-fit px-4 sm:px-10 py-2 sm:py-3 rounded-lg ${className}`}
    >
      {text}
    </button>
  );
}

export default webbutton;
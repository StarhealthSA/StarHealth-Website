function BottomNav() {
    return (
        <div className="h-[64px] flex items-center justify-center bg-[#1F4745]">
            <p className="text-[14px] lg:text-[16px] font-normal font-inter text-center text-[#FFFFFF] leading-[22px] lg:leading-[24px]">
              © 2025 All Right Reserved | Powered by
                <a 
                    href="https://www.procube.cx/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#FFFFFF] hover:text-[#FFFFFF99] pl-1"
                >
                  procube.cx
                </a>
            </p>
        </div>
    )
}

export default BottomNav;
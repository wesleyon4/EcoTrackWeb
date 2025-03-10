interface ScanButtonProps {
  onScan: () => void;
}

const ScanButton = ({ onScan }: ScanButtonProps) => {
  return (
    <div className="fixed bottom-20 inset-x-0 flex justify-center md:hidden">
      <button
        onClick={onScan}
        className="scan-button bg-primary hover:bg-primary-dark text-white rounded-full w-14 h-14 flex items-center justify-center"
        aria-label="Scan product"
      >
        <span className="material-icons">qr_code_scanner</span>
      </button>
    </div>
  );
};

export default ScanButton;

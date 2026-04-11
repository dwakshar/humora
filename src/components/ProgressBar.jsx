export default function ProgressBar({ current, total }) {
  const fillWidth = `${(current / total) * 100}%`;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span
          className="font-bold text-[13px] text-[#9CA3AF] uppercase tracking-widest"
          style={{ fontFamily: "Archivo, sans-serif" }}>
          HumanCheck
        </span>
        <span
          className="text-[13px] text-[#9CA3AF]"
          style={{ fontFamily: "Archivo, sans-serif", fontWeight: 400 }}>
          Question {current} of {total}
        </span>
      </div>
      <div
        className="w-full rounded-[999px]"
        style={{ height: "3px", backgroundColor: "#F3F4F6" }}>
        <div
          className="h-full rounded-[999px]"
          style={{
            width: fillWidth,
            backgroundColor: "#4F46E5",
            transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}

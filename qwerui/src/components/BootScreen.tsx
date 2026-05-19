interface BootScreenProps {
  onComplete: () => void;
  isFirstRun: boolean;
}

export default function BootScreen({ onComplete, isFirstRun }: BootScreenProps) {
  const handleVideoEnd = () => {
    onComplete();
  };

  return (
    <div className="absolute inset-0">
      <video
        autoPlay
        playsInline
        muted
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      >
        <source src={isFirstRun ? "/start_phone/OOBE/start_phone_oobe.mp4" : "/start_phone/Normal/zapusk_complected_oobe.mp4"} type="video/mp4" />
      </video>
    </div>
  );
}
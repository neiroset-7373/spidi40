export default function DeepSeekApp() {
  return (
    <div className="h-full w-full relative" style={{ background: '#000' }}>
      <iframe
        src="https://chat.deepseek.com"
        className="w-full h-full border-0"
        title="DeepSeek"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </div>
  );
}

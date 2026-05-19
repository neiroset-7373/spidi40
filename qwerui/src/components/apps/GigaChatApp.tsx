export default function GigaChatApp() {
  return (
    <div className="h-full flex flex-col bg-white">
      <iframe
        src="https://giga.chat/"
        className="flex-1 w-full"
        style={{ border: 'none' }}
        title="GigaChat"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}

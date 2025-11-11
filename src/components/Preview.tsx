interface PreviewProps {
  htmlContent: string;
}

export const Preview = ({ htmlContent }: PreviewProps) => {
  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Preview</h2>
      <div className="border border-gray-200 rounded-lg overflow-auto max-h-[800px]">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

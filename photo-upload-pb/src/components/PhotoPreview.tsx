import { useFileUrl, usePhoto } from "../hooks";

type Props = {
  id: string;
};

export function PhotoPreview({ id }: Props) {
  const { getFileThumbUrl } = useFileUrl();
  const { data } = usePhoto({ id });

  return (
    <div>
      <img
        src={getFileThumbUrl(data, data?.file || id)}
        alt={data?.file || ""}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
    </div>
  );
}

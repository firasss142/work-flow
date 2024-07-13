export class Art {
  name: string;
  description: string;
  artFile: string;
  artType: string;
  publishedAt: Date;
  artist: any;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export class ArtStats {
  totalArts: number;
  hiddenArts: number;
  shownArts: number;
  nftArts: number;
  normalAssetsArts: number;
}

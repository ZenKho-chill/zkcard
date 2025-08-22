export declare class zkcard {
  constructor(options?: {
    name?: string;
    author?: string;
    color?: string;
    theme?: string;
    brightness?: number;
    thumbnail?: string;
  });

  public setName(name: string): this;
  public setAuthor(author: string): this;
  public setColor(color: string): this;
  public setTheme(theme: string): this;
  public setBrightness(brightness: number): this;
  public setThumbnail(thumbnail: string): this;
  public setRequester(requester: string): this;

  public build(): Promise<Buffer>;
}

// Theme API
export declare function getAvailableThemes(): string[];
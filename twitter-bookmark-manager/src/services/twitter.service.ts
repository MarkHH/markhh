import { TwitterApi } from "twitter-api-v2";
import type { TwitterBookmark } from "@/types";

interface TwitterApiConfig {
  bearerToken?: string;
  accessToken?: string;
}

/**
 * Abstracted Twitter API service module.
 *
 * All Twitter API calls are centralized here to allow future scaling
 * via load-balancing or round-robin between multiple API keys.
 * For V1, a single key is used.
 */
export class TwitterService {
  private client: TwitterApi;

  constructor(config: TwitterApiConfig) {
    if (config.accessToken) {
      this.client = new TwitterApi(config.accessToken);
    } else if (config.bearerToken) {
      this.client = new TwitterApi(config.bearerToken);
    } else {
      throw new Error("Twitter API requires either a bearer token or access token");
    }
  }

  static fromUserAccessToken(accessToken: string): TwitterService {
    return new TwitterService({ accessToken });
  }

  static fromBearerToken(): TwitterService {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      throw new Error("TWITTER_BEARER_TOKEN environment variable is not set");
    }
    return new TwitterService({ bearerToken });
  }

  async fetchBookmarks(
    userId: string,
    options?: { maxResults?: number; paginationToken?: string }
  ): Promise<{ bookmarks: TwitterBookmark[]; nextToken?: string }> {
    try {
      const response = await this.client.v2.bookmarks({
        max_results: options?.maxResults ?? 100,
        pagination_token: options?.paginationToken,
        expansions: ["author_id", "attachments.media_keys"],
        "tweet.fields": ["created_at", "text", "author_id", "attachments"],
        "user.fields": ["name", "username", "profile_image_url"],
        "media.fields": ["url", "preview_image_url", "type"],
      });

      const users = new Map(
        (response.includes?.users ?? []).map((u) => [
          u.id,
          {
            name: u.name,
            username: u.username,
            avatar: u.profile_image_url ?? null,
          },
        ])
      );

      const media = new Map(
        (response.includes?.media ?? []).map((m) => [
          m.media_key,
          m.url ?? m.preview_image_url ?? null,
        ])
      );

      const bookmarks: TwitterBookmark[] = (response.data?.data ?? []).map(
        (tweet) => {
          const author = users.get(tweet.author_id ?? "") ?? {
            name: "Unknown",
            username: "unknown",
            avatar: null,
          };

          const mediaUrls: string[] = [];
          if (tweet.attachments?.media_keys) {
            for (const key of tweet.attachments.media_keys) {
              const url = media.get(key);
              if (url) mediaUrls.push(url);
            }
          }

          return {
            tweetId: tweet.id,
            authorName: author.name,
            authorUsername: author.username,
            authorAvatar: author.avatar,
            content: tweet.text,
            mediaUrls,
            tweetCreatedAt: new Date(tweet.created_at ?? Date.now()),
          };
        }
      );

      return {
        bookmarks,
        nextToken: response.data?.meta?.next_token,
      };
    } catch (error) {
      console.error("Failed to fetch bookmarks from Twitter API:", error);
      throw new Error("Failed to fetch bookmarks from Twitter");
    }
  }

  async fetchAllBookmarks(userId: string): Promise<TwitterBookmark[]> {
    const allBookmarks: TwitterBookmark[] = [];
    let nextToken: string | undefined;

    do {
      const result = await this.fetchBookmarks(userId, {
        maxResults: 100,
        paginationToken: nextToken,
      });
      allBookmarks.push(...result.bookmarks);
      nextToken = result.nextToken;
    } while (nextToken);

    return allBookmarks;
  }

  async fetchNewBookmarks(
    userId: string,
    knownTweetIds: Set<string>
  ): Promise<TwitterBookmark[]> {
    const newBookmarks: TwitterBookmark[] = [];
    let nextToken: string | undefined;
    let foundExisting = false;

    do {
      const result = await this.fetchBookmarks(userId, {
        maxResults: 100,
        paginationToken: nextToken,
      });

      for (const bookmark of result.bookmarks) {
        if (knownTweetIds.has(bookmark.tweetId)) {
          foundExisting = true;
          break;
        }
        newBookmarks.push(bookmark);
      }

      nextToken = foundExisting ? undefined : result.nextToken;
    } while (nextToken);

    return newBookmarks;
  }
}

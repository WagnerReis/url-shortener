import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface ShortUrlProps {
  originalUrl: string;
  shortCode: string;
  userId?: string;
  clickCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class ShortUrl extends Entity<ShortUrlProps> {
  get originalUrl() {
    return this.props.originalUrl;
  }

  get shortCode() {
    return this.props.shortCode;
  }

  get userId() {
    return this.props.userId;
  }

  get clickCount() {
    return this.props.clickCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  set originalUrl(originalUrl: string) {
    this.props.originalUrl = originalUrl;
    this.props.updatedAt = new Date();
  }

  deleteUrl() {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  addClick() {
    this.props.clickCount! += 1;
    this.props.updatedAt = new Date();
  }

  static create(props: ShortUrlProps, id?: UniqueEntityId) {
    const shortUrl = new ShortUrl(
      {
        ...props,
        userId: props.userId ?? '',
        clickCount: props.clickCount ?? 0,
        createdAt: props.createdAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );

    return shortUrl;
  }
}

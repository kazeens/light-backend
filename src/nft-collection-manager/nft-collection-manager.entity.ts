import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Document from 'mongoose';

export type NftCollectionManagerDocument = NftCollectionManager & Document;

@Schema({ timestamps: true })
export class NftCollectionManager {
  @Prop()
  contractAddress: string;
  @Prop()
  ownerAddress: string;
  @Prop()
  collectionAddress: string;
}

export const NftCollectionManagerSchema =
  SchemaFactory.createForClass(NftCollectionManager);

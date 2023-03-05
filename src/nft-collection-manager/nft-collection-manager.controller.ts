import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Query,
  Get,
  Headers,
} from '@nestjs/common';
import { NftCollectionManagerService } from 'src/nft-collection-manager/nft-collection-manager.service';
import { CreateNftCollectionManagerDto } from 'src/dto/createNftCollectionManager.dto';

import { ManagerQueryParams } from './nft-collection-manager.dto';
import { HttpService } from '@nestjs/axios';

const tonApiToken =
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsia29seWFuOTgiXSwiZXhwIjoxODM1NzEzODg4LCJpc3MiOiJAdG9uYXBpX2JvdCIsImp0aSI6IjVXR0xRQkhNVjZLV0VSQUJORlZUWUtISyIsInNjb3BlIjoic2VydmVyIiwic3ViIjoidG9uYXBpIn0.09owShXOZOQCQFfwqb12y3At-8fLB53zOFg5dfX-YeiuVbM-M-3wgwHifK6rY6AlSWC_P4GYppy7bycv4lQ2AQ';

@Controller('nft-collection-manager')
export class NftCollectionManagerController {
  constructor(
    private readonly nftCollectionManagerService: NftCollectionManagerService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  async createNftCollectionManagerContract(
    @Res() response,
    @Body() createNftCollectionManagerDto: CreateNftCollectionManagerDto,
    @Headers() headers,
  ) {
    if (!headers.testnet) {
      try {
        await this.httpService
          .request({
            url: 'https://tonapi.io/v1/nft/getCollection',
            method: 'get',
            params: {
              account: createNftCollectionManagerDto.collectionAddress,
            },
            headers: {
              Authorization: tonApiToken,
            },
          })
          .toPromise();
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Could not create transaction',
          error: 'Bad request',
        });
      }
    }

    const exiting =
      await this.nftCollectionManagerService.findByCollectionAddress(
        createNftCollectionManagerDto.collectionAddress,
      );

    if (exiting) {
      return response.status(HttpStatus.CREATED).json(exiting);
    }

    try {
      const newNftCollectionManager =
        await this.nftCollectionManagerService.createNftCollectionManager(
          createNftCollectionManagerDto,
        );

      return response.status(HttpStatus.CREATED).json(newNftCollectionManager);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error nft collection manager has not been created',
        error: 'Bad request',
      });
    }
  }

  @Get('/')
  async getAll(
    @Query() { skip, limit = 10, ownerAddress }: ManagerQueryParams,
  ) {
    const query = ownerAddress ? { ownerAddress } : {};

    const result = await this.nftCollectionManagerService.findAll(
      query,
      skip,
      limit,
    );

    return result;
  }
}
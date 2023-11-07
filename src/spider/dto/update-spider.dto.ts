import { PartialType } from '@nestjs/swagger';
import { CreateSpiderDto } from './create-spider.dto';

export class UpdateSpiderDto extends PartialType(CreateSpiderDto) {}

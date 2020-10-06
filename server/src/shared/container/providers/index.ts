import {container} from 'tsyringe';

import mailConfig from '@config/mail';
import uploadConfig from '@config/upload';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from './MailProvider/implementations/SESMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

import ICacheProvider from './CacheProvider/models/ICacheProvider';
import RedisCacheProvider from './CacheProvider/implementations/RedisCacheProvider';


container.registerInstance<IStorageProvider>('StorageProvider', uploadConfig.driver === 'disk' ? 
container.resolve(DiskStorageProvider) : container.resolve(S3StorageProvider));

container.registerSingleton<IMailTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider);

container.registerInstance<IMailProvider>('MailProvider', mailConfig.driver === 'ethereal' ? 
container.resolve(EtherealMailProvider) : container.resolve(SESMailProvider));

container.registerSingleton<ICacheProvider>('CacheProvider', RedisCacheProvider);
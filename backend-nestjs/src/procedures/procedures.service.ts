import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  findAll(q?: string) {
    if (!q) {
      return this.prisma.administrativeProcedure.findMany({
        orderBy: { title: 'asc' },
      });
    }

    return this.prisma.administrativeProcedure.findMany({
      where: {
        title: { contains: q, mode: 'insensitive' },
      },
      orderBy: { title: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.administrativeProcedure.findUnique({ where: { id } });
  }

  async previewImport(buffer: Buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const existingCodes = (await this.prisma.administrativeProcedure.findMany({ select: { code: true } })).map(p => p.code);
    
    const conflicts = data.filter((row: any) => existingCodes.includes(row['Mã thủ tục']?.toString()?.trim()));
    const newRecords = data.filter((row: any) => row['Mã thủ tục'] && !existingCodes.includes(row['Mã thủ tục']?.toString()?.trim()));
    
    return { newCount: newRecords.length, conflictCount: conflicts.length, conflicts };
  }

  async executeImport(buffer: Buffer, overwrite: boolean) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    let successCount = 0;
    for (const row of data as any[]) {
      const rawCode = row['Mã thủ tục']?.toString()?.trim();
      if (!rawCode) continue;

      const payload = {
        title: row['Tên thủ tục']?.toString() || '',
        description: row['Mô tả']?.toString() || '',
        fee: row['Lệ phí']?.toString() || '',
        duration: row['Thời gian']?.toString() || '',
        process_steps: row['Các bước']?.toString() || '',
        is_active: true
      };

      if (overwrite) {
        await this.prisma.administrativeProcedure.upsert({
          where: { code: rawCode },
          update: payload,
          create: { code: rawCode, ...payload }
        });
        successCount++;
      } else {
        const exists = await this.prisma.administrativeProcedure.findUnique({ where: { code: rawCode } });
        if (!exists) {
          await this.prisma.administrativeProcedure.create({ data: { code: rawCode, ...payload } });
          successCount++;
        }
      }
    }
    return { successCount };
  }
}

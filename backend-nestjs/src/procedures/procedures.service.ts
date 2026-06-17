import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';

type ImportRow = Record<string, unknown>;

const PROCEDURE_IMPORT_HEADERS = {
  code: ['Mã thủ tục', 'MÃ£ thá»§ tá»¥c'],
  title: ['Tên thủ tục', 'TÃªn thá»§ tá»¥c'],
  description: ['Mô tả', 'MÃ´ táº£'],
  fee: ['Lệ phí', 'Lá»‡ phÃ­'],
  duration: ['Thời gian', 'Thá»i gian'],
  processSteps: ['Các bước', 'CÃ¡c bÆ°á»›c'],
};

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  private normalizeSearch(value?: string | null) {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\u0111/g, 'd')
      .replace(/\u0110/g, 'D')
      .toLowerCase();
  }

  private getImportValue(row: ImportRow, headers: string[]) {
    for (const header of headers) {
      const value = row[header];
      if (value !== undefined && value !== null) {
        return value.toString().trim();
      }
    }
    return '';
  }

  async findAll(q?: string) {
    const procedures = await this.prisma.administrativeProcedure.findMany({
      where: { is_active: true },
      orderBy: { title: 'asc' },
    });

    if (!q) return procedures;

    const normalizedQuery = this.normalizeSearch(q);
    return procedures.filter((procedure) =>
      this.normalizeSearch(
        [
          procedure.code,
          procedure.title,
          procedure.description,
          procedure.fee,
          procedure.duration,
          procedure.process_steps,
        ].join(' '),
      ).includes(normalizedQuery),
    );
  }

  findOne(id: number) {
    return this.prisma.administrativeProcedure.findUnique({ where: { id } });
  }

  async previewImport(buffer: Buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json<ImportRow>(sheet);

    const existingCodes = (
      await this.prisma.administrativeProcedure.findMany({
        select: { code: true },
      })
    ).map((procedure) => procedure.code);

    const conflicts = data.filter((row) =>
      existingCodes.includes(
        this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.code),
      ),
    );
    const newRecords = data.filter((row) => {
      const code = this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.code);
      return code && !existingCodes.includes(code);
    });

    return {
      newCount: newRecords.length,
      conflictCount: conflicts.length,
      conflicts,
    };
  }

  async executeImport(buffer: Buffer, overwrite: boolean) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json<ImportRow>(sheet);

    let successCount = 0;
    for (const row of data) {
      const rawCode = this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.code);
      if (!rawCode) continue;

      const payload = {
        title: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.title),
        description: this.getImportValue(
          row,
          PROCEDURE_IMPORT_HEADERS.description,
        ),
        fee: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.fee),
        duration: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.duration),
        process_steps: this.getImportValue(
          row,
          PROCEDURE_IMPORT_HEADERS.processSteps,
        ),
        is_active: true,
      };

      if (overwrite) {
        await this.prisma.administrativeProcedure.upsert({
          where: { code: rawCode },
          update: payload,
          create: { code: rawCode, ...payload },
        });
        successCount++;
      } else {
        const exists = await this.prisma.administrativeProcedure.findUnique({
          where: { code: rawCode },
        });
        if (!exists) {
          await this.prisma.administrativeProcedure.create({
            data: { code: rawCode, ...payload },
          });
          successCount++;
        }
      }
    }
    return { successCount };
  }
}


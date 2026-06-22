import { Controller, Get } from '@nestjs/common';

@Controller('organization')
export class OrganizationController {
  @Get()
  getOrganization() {
    return {
      id: "org-1",
      name: "UBND Tỉnh Đắc Lắc",
      description: "Chính quyền số",
      logoUrl: "https://via.placeholder.com/150",
      officialAccounts: []
    };
  }
}

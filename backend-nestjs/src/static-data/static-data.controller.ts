import { Controller, Get } from '@nestjs/common';

@Controller()
export class StaticDataController {
  @Get('hotlines')
  getHotlines() {
    return [
      { name: "UBND xã", phone: "02623.xxx.xxx", description: "Đường dây nóng" },
      { name: "Công an xã", phone: "113", description: "An ninh trật tự" },
      { name: "Y tế xã", phone: "115", description: "Cấp cứu y tế" },
    ];
  }

  @Get('locations')
  getLocations() {
    return [
      { name: "UBND xã Nghĩa Trụ", lat: 20.85, lng: 106.05, address: "Xã Nghĩa Trụ, Văn Giang, Hưng Yên" },
    ];
  }

  @Get('feedbacks/types')
  getFeedbackTypes() {
    return [
      { id: 1, name: "Phản ánh môi trường" },
      { id: 2, name: "Phản ánh hạ tầng" },
      { id: 3, name: "Phản ánh an ninh trật tự" },
      { id: 4, name: "Góp ý, kiến nghị" },
    ];
  }

  @Get('search')
  search() {
    return { results: [] };
  }
}

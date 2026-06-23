import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://root:password@127.0.0.1:5433/tu_lan_smart?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bắt đầu bơm dữ liệu Demo thông minh (Append Only)...');

  // 1. TẠO THỦ TỤC HÀNH CHÍNH
  const procedures = [
    {
      code: 'DEMO-TTHC-001',
      title: '[Demo] Thủ tục cấp Căn cước công dân gắn chíp',
      description: 'Quy trình, thủ tục cấp thẻ Căn cước công dân (CCCD) gắn chíp cho người dân địa phương.',
      duration: '7 ngày làm việc',
      fee: '30.000 VNĐ',
      process_steps: '1. Sổ hộ khẩu (nếu có)\n2. CMND/CCCD cũ\n3. Giấy khai sinh (bản sao)',
    },
    {
      code: 'DEMO-TTHC-002',
      title: '[Demo] Thủ tục Đăng ký kết hôn',
      description: 'Hướng dẫn thủ tục đăng ký kết hôn tại UBND cấp xã/phường cho công dân Việt Nam.',
      duration: '1 ngày làm việc',
      fee: 'Miễn phí',
      process_steps: '1. Tờ khai đăng ký kết hôn\n2. Giấy xác nhận tình trạng hôn nhân\n3. CCCD của cả nam và nữ',
    },
    {
      code: 'DEMO-TTHC-003',
      title: '[Demo] Thủ tục Cấp giấy chứng nhận quyền sử dụng đất (Sổ đỏ)',
      description: 'Trình tự, thủ tục cấp giấy chứng nhận quyền sử dụng đất lần đầu cho hộ gia đình, cá nhân.',
      duration: '30 ngày làm việc',
      fee: 'Theo quy định của nhà nước (tùy diện tích)',
      process_steps: '1. Đơn đăng ký cấp Sổ đỏ\n2. Giấy tờ chứng minh quyền sử dụng đất\n3. Chứng từ hoàn thành nghĩa vụ tài chính',
    }
  ];

  for (const proc of procedures) {
    const existing = await prisma.administrativeProcedure.findUnique({
      where: { code: proc.code }
    });
    if (!existing) {
      await prisma.administrativeProcedure.create({ data: proc });
      console.log(`[+] Đã thêm: ${proc.title}`);
    } else {
      console.log(`[-] Bỏ qua (đã tồn tại): ${proc.title}`);
    }
  }

  // 2. TẠO TIN TỨC (NEWS)
  const newsList = [
    {
      title: '[Demo] Khai mạc Đại hội Thể dục Thể thao toàn xã lần thứ X',
      content: 'Sáng nay, tại sân vận động trung tâm, Đại hội Thể dục Thể thao toàn xã lần thứ X chính thức được khai mạc với sự tham gia của hơn 500 vận động viên đến từ 12 thôn, bản. Đại hội bao gồm các môn thi đấu: Bóng đá, Bóng chuyền hơi, Cầu lông và Kéo co. Đây là hoạt động thường niên nhằm nâng cao tinh thần rèn luyện sức khỏe của bà con nhân dân.',
      thumbnail: 'https://placehold.co/600x400/png?text=Dai+Hoi+The+Thao',
    },
    {
      title: '[Demo] Thông báo Lịch cắt điện luân phiên tuần tới',
      content: 'Điện lực thông báo lịch cắt điện luân phiên tuần tới từ ngày 15 đến ngày 20 để phục vụ công tác bảo trì đường dây trung thế. Cụ thể: Thôn A mất điện sáng thứ 2, Thôn B mất điện chiều thứ 3. Kính mong bà con chủ động sắp xếp sinh hoạt và sản xuất.',
      thumbnail: 'https://placehold.co/600x400/png?text=Thong+Bao+Cat+Dien',
    },
    {
      title: '[Demo] Hội nghị tập huấn công tác phòng cháy chữa cháy năm 2026',
      content: 'Công an phối hợp cùng chính quyền địa phương vừa tổ chức buổi tập huấn kỹ năng Phòng cháy chữa cháy (PCCC) cho các hộ kinh doanh và người dân trên địa bàn. Qua buổi tập huấn, người dân đã nắm được cách sử dụng bình chữa cháy mini và kỹ năng thoát hiểm khi có hỏa hoạn xảy ra.',
      thumbnail: 'https://placehold.co/600x400/png?text=Tap+Huan+PCCC',
    }
  ];

  for (const news of newsList) {
    const existing = await prisma.news.findFirst({
      where: { title: news.title }
    });
    if (!existing) {
      await prisma.news.create({ data: news });
      console.log(`[+] Đã thêm: ${news.title}`);
    } else {
      console.log(`[-] Bỏ qua (đã tồn tại): ${news.title}`);
    }
  }

  // 3. TẠO VĂN BẢN (DOCUMENTS)
  const documents = [
    {
      document_no: 'DEMO-VB-1102',
      abstract: '[Demo] Quyết định phê duyệt kế hoạch sử dụng đất năm 2026. Căn cứ Luật Tổ chức chính quyền địa phương, nay ban hành quyết định phê duyệt kế hoạch sử dụng đất chi tiết năm 2026 cho các hạng mục công trình công cộng và dân sinh.',
      type: 'Quyết định',
      file_url: 'https://example.com/demo.pdf',
    },
    {
      document_no: 'DEMO-VB-1103',
      abstract: '[Demo] Kế hoạch triển khai tiêm vắc xin cho trẻ em. Trạm y tế xin thông báo kế hoạch tiêm chủng các loại vắc xin (Sởi, Rubella, Bạch hầu) cho trẻ em dưới 5 tuổi vào đợt 1 tháng 7 năm 2026.',
      type: 'Kế hoạch',
      file_url: 'https://example.com/demo2.pdf',
    }
  ];

  for (const doc of documents) {
    const existing = await prisma.document.findUnique({
      where: { document_no: doc.document_no }
    });
    if (!existing) {
      await prisma.document.create({ data: doc });
      console.log(`[+] Đã thêm: ${doc.abstract.substring(0, 40)}...`);
    } else {
      console.log(`[-] Bỏ qua (đã tồn tại): ${doc.abstract.substring(0, 40)}...`);
    }
  }

  console.log('✅ Hoàn tất bơm dữ liệu Demo thông minh!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

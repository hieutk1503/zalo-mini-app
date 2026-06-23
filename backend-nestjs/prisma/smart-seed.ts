import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL || 'postgresql://root:password@127.0.0.1:5433/tu_lan_smart?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bắt đầu bơm dữ liệu Demo toàn diện (Append Only)...');

  // --- 1. ADMIN & CITIZEN ---
  const passwordHash = await bcrypt.hash('admin123', 10);
  let admin = await prisma.admin.findUnique({ where: { email: 'admin@demo.com' } });
  if (!admin) {
    admin = await prisma.admin.create({
      data: {
        email: 'admin@demo.com',
        password_hash: passwordHash,
        full_name: '[Demo] Quản trị viên',
        role: 'ADMIN',
      }
    });
    console.log(`[+] Đã thêm Admin: ${admin.full_name}`);
  }

  let citizen = await prisma.citizen.findUnique({ where: { zalo_id: 'ZALO_DEMO_001' } });
  if (!citizen) {
    citizen = await prisma.citizen.create({
      data: {
        zalo_id: 'ZALO_DEMO_001',
        full_name: '[Demo] Nguyễn Văn Công Dân',
        phone: '0987654321',
        cccd: '012345678912',
      }
    });
    console.log(`[+] Đã thêm Công dân: ${citizen.full_name}`);
  }

  // --- 2. THỦ TỤC HÀNH CHÍNH & BIỂU MẪU ---
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
    }
  ];

  let firstProcedureId = null;
  for (const proc of procedures) {
    let existing = await prisma.administrativeProcedure.findUnique({ where: { code: proc.code } });
    if (!existing) {
      existing = await prisma.administrativeProcedure.create({ data: proc });
      console.log(`[+] Đã thêm Thủ tục: ${proc.title}`);
    }
    if (!firstProcedureId) firstProcedureId = existing.id;
  }

  // Thêm Form Template cho Thủ tục đầu tiên
  if (firstProcedureId) {
    const existingForm = await prisma.formTemplate.findFirst({ where: { procedure_id: firstProcedureId } });
    if (!existingForm) {
      await prisma.formTemplate.create({
        data: {
          name: '[Demo] Mẫu tờ khai CCCD 2026',
          file_url: 'https://example.com/form-cccd.pdf',
          procedure_id: firstProcedureId
        }
      });
      console.log(`[+] Đã thêm Biểu mẫu thủ tục`);
    }
  }

  // --- 3. TIN TỨC (NEWS) ---
  const newsList = [
    {
      title: '[Demo] Khai mạc Đại hội Thể dục Thể thao toàn xã lần thứ X',
      content: 'Sáng nay, tại sân vận động trung tâm, Đại hội Thể dục Thể thao toàn xã lần thứ X chính thức được khai mạc với sự tham gia của hơn 500 vận động viên đến từ 12 thôn, bản.',
      thumbnail: 'https://placehold.co/600x400/png?text=Dai+Hoi+The+Thao',
    }
  ];

  for (const news of newsList) {
    const existing = await prisma.news.findFirst({ where: { title: news.title } });
    if (!existing) {
      await prisma.news.create({ data: news });
      console.log(`[+] Đã thêm Tin tức: ${news.title}`);
    }
  }

  // --- 4. VĂN BẢN (DOCUMENTS) ---
  const documents = [
    {
      document_no: 'DEMO-VB-1102',
      abstract: '[Demo] Quyết định phê duyệt kế hoạch sử dụng đất năm 2026.',
      type: 'Quyết định',
      file_url: 'https://example.com/demo.pdf',
    }
  ];

  for (const doc of documents) {
    const existing = await prisma.document.findUnique({ where: { document_no: doc.document_no } });
    if (!existing) {
      await prisma.document.create({ data: doc });
      console.log(`[+] Đã thêm Văn bản: ${doc.document_no}`);
    }
  }

  // --- 5. LỊCH HẸN (APPOINTMENT) & PHẢN ÁNH (FEEDBACK) ---
  const existingAppt = await prisma.appointment.findUnique({ where: { ticket_number: 'DEMO-TICKET-01' } });
  if (!existingAppt) {
    await prisma.appointment.create({
      data: {
        ticket_number: 'DEMO-TICKET-01',
        citizen_id: citizen.id,
        appointment_date: new Date('2026-07-01T08:00:00Z'),
        time_slot: '08:00 - 09:00',
        content: '[Demo] Hẹn làm thủ tục chứng thực chữ ký',
        status: 'PENDING'
      }
    });
    console.log(`[+] Đã thêm Lịch hẹn: DEMO-TICKET-01`);
  }

  const existingFeedback = await prisma.feedback.findFirst({ where: { content: { contains: '[Demo]' } } });
  if (!existingFeedback) {
    await prisma.feedback.create({
      data: {
        citizen_id: citizen.id,
        content: '[Demo] Đèn đường tại ngã tư xóm 3 bị hỏng đã 1 tuần nay, gây nguy hiểm cho người tham gia giao thông.',
        image_urls: 'https://placehold.co/400x300/png?text=Den+Duong+Hong',
        status: 'PROCESSING',
        location: 'Ngã tư xóm 3',
        admin_reply: 'UBND đã tiếp nhận và cử cán bộ điện lực xuống khắc phục trong hôm nay.'
      }
    });
    console.log(`[+] Đã thêm Phản ánh hiện trường`);
  }

  // --- 6. QUY HOẠCH (PLANNING) ---
  const existingPlanning = await prisma.planning.findFirst({ where: { title: { contains: '[Demo]' } } });
  if (!existingPlanning) {
    await prisma.planning.create({
      data: {
        title: '[Demo] Quy hoạch khu công nghiệp mới giai đoạn 2026-2030',
        content: 'Bản đồ quy hoạch chi tiết 1/500 khu công nghiệp xanh phía Nam. Dự kiến tạo ra 5000 việc làm cho người lao động.',
        image: 'https://placehold.co/800x600/png?text=Ban+Do+Quy+Hoach',
        file_url: 'https://example.com/quyhoach.pdf'
      }
    });
    console.log(`[+] Đã thêm Quy hoạch`);
  }

  // --- 7. DỰ ÁN ĐẦU TƯ (INVESTMENT PROJECT) ---
  const existingProject = await prisma.investmentProject.findFirst({ where: { project_name: { contains: '[Demo]' } } });
  if (!existingProject) {
    await prisma.investmentProject.create({
      data: {
        project_name: '[Demo] Nâng cấp đường trục chính liên xã',
        description: 'Dự án trải nhựa 5km đường trục chính, lắp đặt hệ thống cống thoát nước và đèn chiếu sáng.',
        status: 'Đang triển khai',
        start_date: new Date('2026-01-01'),
        end_date: new Date('2026-12-31'),
        budget: 15000000000, // 15 tỷ
      }
    });
    console.log(`[+] Đã thêm Dự án đầu tư`);
  }

  // --- 8. ĐẤU THẦU (BIDDING) ---
  const existingBidding = await prisma.bidding.findFirst({ where: { package_name: { contains: '[Demo]' } } });
  if (!existingBidding) {
    await prisma.bidding.create({
      data: {
        package_name: '[Demo] Mua sắm trang thiết bị y tế cho Trạm Y tế',
        price: 500000000, // 500 triệu
        start_date: new Date('2026-06-01'),
        end_date: new Date('2026-06-30'),
        requirements_file: 'https://example.com/hoso-dauthau.pdf'
      }
    });
    console.log(`[+] Đã thêm Gói thầu`);
  }

  // --- 9. LỊCH LÀM VIỆC (WORK SCHEDULE) ---
  const existingSchedule = await prisma.workSchedule.findFirst({ where: { title: { contains: '[Demo]' } } });
  if (!existingSchedule) {
    await prisma.workSchedule.create({
      data: {
        title: '[Demo] Họp giao ban Thường trực HĐND - UBND',
        event_date: new Date('2026-06-25'),
        time: '08:00',
        location: 'Phòng họp số 1',
        attendees: 'Chủ tịch, các Phó Chủ tịch, Trưởng các ban ngành'
      }
    });
    console.log(`[+] Đã thêm Lịch làm việc`);
  }

  // --- 10. KHẢO SÁT (SURVEY) ---
  const existingSurvey = await prisma.survey.findFirst({ where: { comment: { contains: '[Demo]' } } });
  if (!existingSurvey) {
    await prisma.survey.create({
      data: {
        rating: 5,
        comment: '[Demo] Thái độ phục vụ của cán bộ một cửa rất nhiệt tình.',
        user_zalo_id: citizen.zalo_id
      }
    });
    console.log(`[+] Đã thêm Đánh giá khảo sát`);
  }

  console.log('✅ Hoàn tất bơm dữ liệu TOÀN DIỆN!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

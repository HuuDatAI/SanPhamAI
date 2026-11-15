const fs=require('fs');
function edit(p,f){let s=fs.readFileSync(p,'utf8');const o=s;s=f(s);if(s===o)throw new Error('không đổi '+p);fs.writeFileSync(p,s);}
const rep=(s,a,b)=>{if(!s.includes(a))throw new Error('thiếu '+a.slice(0,50));return s.replace(a,b);};
edit('src/data/courseCovers.ts',s=>{
 s=rep(s,"import excelBi from '../assets/courses/excel-power-query-power-bi.webp';","import excelBi from '../assets/courses/excel-power-query-power-bi.webp';\nimport looker from '../assets/courses/looker-studio-dashboard.webp';");
 s=rep(s,"  'excel-power-query-power-bi': {","  'looker-studio-dashboard': { src: looker, alt: 'Ví dụ dashboard Looker Studio: thẻ chỉ số tổng hợp, biểu đồ xu hướng, cơ cấu và bộ lọc theo thời gian, đơn vị, phòng ban' },\n  'excel-power-query-power-bi': {");
 s=rep(s,"export const courseCovers","/** Ghi chú: bìa Looker Studio là ảnh chụp một dashboard ví dụ, đã cắt bỏ phần dưới có bảng tên người. Các bìa còn lại là artwork thiết kế. */\nexport const courseCovers");
 return s;});
edit('src/data/courses.ts',s=>{
 const marker="];\n";
 const i=s.indexOf("\n];\n");if(i<0)throw new Error('không thấy cuối courseList');
 const add=`  { id: 'c-looker', slug: 'looker-studio-dashboard', title: 'Looker Studio — Dashboard báo cáo', group: 'du-lieu', origin: 'owner_listed',
    summary: 'Xây dựng dashboard báo cáo trên Looker Studio: kết nối dữ liệu, thiết kế biểu đồ, bộ lọc và trình bày cho người quản lý.',
    intro: 'Tôi hướng dẫn xây dựng dashboard báo cáo trên Looker Studio: từ dữ liệu nguồn như Google Sheets đến các thẻ chỉ số, biểu đồ và bộ lọc để người quản lý theo dõi tình hình theo thời gian, đơn vị và nhóm. Hình bên là ví dụ giao diện một dashboard.',
    audience: ['Người làm báo cáo, vận hành, nhân sự, kinh doanh và kế toán cần trình bày số liệu cho người quản lý'], syllabus: [],
    practice: 'Nội dung điều chỉnh theo công việc và nhu cầu người học.',
    ...common, featured: false, sortOrder: 11, art: 'sheet' },`;
 s=s.slice(0,i)+"\n"+add+s.slice(i);
 return s;});

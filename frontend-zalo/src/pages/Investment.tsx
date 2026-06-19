import React, { useEffect, useState } from 'react';
import { Page, Box, Text, List } from 'zmp-ui';
import api from '../lib/api';

export default function Investment() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get('/investment').then(res => setData(res.data)).catch(console.error);
  }, []);

  return (
    <Page className="bg-gray-100">
      <Box className="p-4 bg-white shadow-sm mb-2">
        <Text size="xLarge" className="font-bold text-primary">Dự án đầu tư</Text>
      </Box>
      <List>
        {data.map((item: any) => (
          <List.Item key={item.id} title={item.title || item.project_name || item.package_name || item.name} subTitle={new Date(item.created_at).toLocaleDateString()} />
        ))}
      </List>
    </Page>
  );
}

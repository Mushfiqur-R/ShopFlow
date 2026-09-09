import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data in reverse order of dependencies
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create 2 Users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  });

  console.log(`Created users: ${user1.email}, ${user2.email}`);

  // Create 5 Products with Inventory
  const productsData = [
    {
      name: 'Laptop Pro 15',
      description: 'High performance laptop for developers',
      price: 1299.99,
      quantity: 50,
    },
    {
      name: 'Wireless Ergonomic Mouse',
      description: 'Comfortable wireless mouse with quiet click',
      price: 49.99,
      quantity: 150,
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB mechanical keyboard with tactile switches',
      price: 89.99,
      quantity: 80,
    },
    {
      name: '4K Ultra HD Monitor 27"',
      description: 'IPS panel 4K monitor with HDR support',
      price: 349.99,
      quantity: 30,
    },
    {
      name: 'Noise Cancelling Headphones',
      description: 'Over-ear headphones with active noise cancellation',
      price: 199.99,
      quantity: 100,
    },
  ];

  for (const item of productsData) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        inventory: {
          create: {
            quantity: item.quantity,
            reserved: 0,
          },
        },
      },
      include: {
        inventory: true,
      },
    });
    console.log(`Created product: ${product.name} (Stock: ${product.inventory?.quantity})`);
  }

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

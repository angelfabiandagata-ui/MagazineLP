const db = import('../config/db.js');

const getAllCommerces = async () => {
  const query = `
    SELECT c.*, array_agg(l.label) as labels 
    FROM commerce c
    LEFT JOIN label l ON c.id = l.commerce_id
    GROUP BY c.id;
  `;
  const { rows } = await db.query(query);
  return rows;
};

export default { getAllCommerces };
using IngresoSML2.Data;
using IngresoSML2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace IngresoSML2.Controllers
{
    [Route("/api/invoice")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public class Post
        {
            public int CustomerId { get; set; }
            public List<InvoiceItem> InvoiceItem { get; set; }

        }
        public InvoiceController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices()
        {
            return await dbContext.Invoices.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            Invoice invoice = await dbContext.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            return invoice;

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoice(int id, [FromBody] Invoice invoice)
        {
            if (id != invoice.Id || invoice.CustomerId <= 0)
            {
                return BadRequest();
            }
            Invoice oldEnvoice = await dbContext.Invoices.FindAsync(id);
            invoice.Date = oldEnvoice.Date;
            
            dbContext.Entry(invoice).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch
            {
                if (!InvoiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetInvoice", new { id = invoice.Id }, invoice);
        }


        [HttpPost]
        public async Task<ActionResult<Invoice>> PostCustomer([FromBody] Invoice invoice)
        {
            if (invoice.CustomerId <= 0)
            {
                return BadRequest();
            }
            if (!CustomerExists(invoice.CustomerId))
            {
                return NotFound();
            }

            invoice.Date = DateTime.Now;

            dbContext.Invoices.Add(invoice);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetInvoice", new { id = invoice.Id }, invoice);
        }


        [HttpPost("post")]
        public async Task<ActionResult<IEnumerable<InvoiceItem>>> PostInvoice([FromBody] Post post)
        {

            
            if (post == null || !CustomerExists(post.CustomerId))
            {
                return BadRequest(); 
            }

            if (post.InvoiceItem==null || !ValidateInvoiceItems(post.InvoiceItem))
            {
                return BadRequest("Los códigos de producto en InvoiceItem están repetidos.");
            }




            Invoice invoice = new Invoice
            {
                CustomerId = post.CustomerId,
                Date = DateTime.Now
            };

            try
            {
                
                 // Asignar el CustomerId correctamente
                dbContext.Invoices.Add(invoice);
                await dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
               
                Console.WriteLine(ex.Message);
                return BadRequest("Error al agregar la factura.");
            }

           
            foreach (InvoiceItem invoiceItem in post.InvoiceItem)
            {
                invoiceItem.InvoiceId = invoice.Id; // Asignar el InvoiceId correctamente
                dbContext.InvoiceItems.Add(invoiceItem);
            }

            
            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                
                Console.WriteLine(ex.Message);
                return BadRequest("Error al agregar los elementos de factura.");
            }
            List<InvoiceItem> result = new List<InvoiceItem>();
            foreach (InvoiceItem invoiceItem in post.InvoiceItem)
            {
                InvoiceItem item = new InvoiceItem
                {
                    InvoiceId = invoiceItem.InvoiceId,
                    ProductCode = invoiceItem.ProductCode,
                    InvoiceItemId = invoiceItem.InvoiceItemId

                };
                result.Add(item);
            }
            // Devolver una respuesta exitosa
            return Ok(result);
        }

        public bool ValidateInvoiceItems(IEnumerable<InvoiceItem> items)
        {
            HashSet<string> productCodes = new HashSet<string>();

            foreach (var item in items)
            {
                // Verificar si el código del producto ya está en el conjunto
                if (!productCodes.Add(item.ProductCode))
                {
                    // Si el código del producto ya está en el conjunto, significa que está repetido
                    return false;
                }
            }

            // Si no se encontraron códigos de productos repetidos, la validación pasa
            return true;
        }
        private bool InvoiceExists(int id)
        {
            return dbContext.Invoices.Any(e => e.Id == id);
        }

        private bool CustomerExists(int id)
        {
            return dbContext.Customers.Any(e => e.CustomerId == id);
        }




    }
}

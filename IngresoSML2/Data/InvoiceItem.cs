﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace IngresoSML2.Data
{
    [Table("invoiceitem")]
    public class InvoiceItem
    {
        [Key]
        public int InvoiceItemId { get; set; }
        public int InvoiceId { get; set; }
        public string ProductCode { get; set; }

        [ForeignKey("InvoiceId")]
        public virtual Invoice Invoice { get; set; }
    }
}

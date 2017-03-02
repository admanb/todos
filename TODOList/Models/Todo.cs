using System;
using System.ComponentModel.DataAnnotations;

namespace TODOList.Models
{
    public class Todo
    {
        public int ID { get; set; }
        [Required]
        public string Task { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        public bool Completed { get; set; } = false;
        public string Details { get; set; }
    }
}
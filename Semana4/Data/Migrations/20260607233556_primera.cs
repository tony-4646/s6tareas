using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Semana4.Data.Migrations
{
    /// <inheritdoc />
    public partial class primera : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    Cli_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cli_Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cli_Cedula = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Cli_Telefono = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Cli_Direccion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Cli_Registro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Cli_Id);
                });

            migrationBuilder.CreateTable(
                name: "Paquetes",
                columns: table => new
                {
                    Paq_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Paq_Contenido = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Paq_Tamano = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Paq_Precio = table.Column<double>(type: "float", nullable: false),
                    Paq_Almacen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Paq_Registro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paquetes", x => x.Paq_Id);
                });

            migrationBuilder.CreateTable(
                name: "Entregas",
                columns: table => new
                {
                    Ent_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cli_Id = table.Column<int>(type: "int", nullable: false),
                    Paq_Id = table.Column<int>(type: "int", nullable: false),
                    Ent_FechaAEntregar = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ent_Observaciones = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ent_Registro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entregas", x => x.Ent_Id);
                    table.ForeignKey(
                        name: "FK_Entregas_Clientes_Cli_Id",
                        column: x => x.Cli_Id,
                        principalTable: "Clientes",
                        principalColumn: "Cli_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Entregas_Paquetes_Paq_Id",
                        column: x => x.Paq_Id,
                        principalTable: "Paquetes",
                        principalColumn: "Paq_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entregas_Cli_Id",
                table: "Entregas",
                column: "Cli_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Entregas_Paq_Id",
                table: "Entregas",
                column: "Paq_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Entregas");

            migrationBuilder.DropTable(
                name: "Clientes");

            migrationBuilder.DropTable(
                name: "Paquetes");
        }
    }
}

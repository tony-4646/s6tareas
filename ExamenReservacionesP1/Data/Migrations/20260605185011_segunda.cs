using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamenReservacionesP1.Data.Migrations
{
    /// <inheritdoc />
    public partial class segunda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClientesModel",
                columns: table => new
                {
                    Cliente_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cli_Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Cli_Apellido = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Cli_Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cli_Telefono = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientesModel", x => x.Cliente_Id);
                });

            migrationBuilder.CreateTable(
                name: "EventosModel",
                columns: table => new
                {
                    Evento_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Eve_Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Eve_Descripcion = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Eve_Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Eve_Ubicacion = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventosModel", x => x.Evento_Id);
                });

            migrationBuilder.CreateTable(
                name: "ReservacionesModel",
                columns: table => new
                {
                    Num_Reserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha_Reserva = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Estado = table.Column<bool>(type: "bit", nullable: false),
                    Cliente_Id = table.Column<int>(type: "int", nullable: false),
                    Evento_Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservacionesModel", x => x.Num_Reserva);
                    table.ForeignKey(
                        name: "FK_ReservacionesModel_ClientesModel_Cliente_Id",
                        column: x => x.Cliente_Id,
                        principalTable: "ClientesModel",
                        principalColumn: "Cliente_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservacionesModel_EventosModel_Evento_Id",
                        column: x => x.Evento_Id,
                        principalTable: "EventosModel",
                        principalColumn: "Evento_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReservacionesModel_Cliente_Id",
                table: "ReservacionesModel",
                column: "Cliente_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ReservacionesModel_Evento_Id",
                table: "ReservacionesModel",
                column: "Evento_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReservacionesModel");

            migrationBuilder.DropTable(
                name: "ClientesModel");

            migrationBuilder.DropTable(
                name: "EventosModel");
        }
    }
}

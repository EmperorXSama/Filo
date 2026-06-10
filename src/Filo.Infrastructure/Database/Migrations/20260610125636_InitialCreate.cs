using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Filo.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Filo");

            migrationBuilder.CreateTable(
                name: "DummyItems",
                schema: "Filo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DummyItems", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DummyItems_IsActive",
                schema: "Filo",
                table: "DummyItems",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_DummyItems_Name",
                schema: "Filo",
                table: "DummyItems",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DummyItems",
                schema: "Filo");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Filo.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreateUsersRolesPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Permissions",
                schema: "Filo",
                columns: table => new
                {
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "Filo",
                columns: table => new
                {
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Filo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentityId = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeletedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    FullName_FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FullName_LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                schema: "Filo",
                columns: table => new
                {
                    PermissionsCode = table.Column<string>(type: "character varying(100)", nullable: false),
                    RoleName = table.Column<string>(type: "character varying(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.PermissionsCode, x.RoleName });
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionsCode",
                        column: x => x.PermissionsCode,
                        principalSchema: "Filo",
                        principalTable: "Permissions",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleName",
                        column: x => x.RoleName,
                        principalSchema: "Filo",
                        principalTable: "Roles",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                schema: "Filo",
                columns: table => new
                {
                    RolesName = table.Column<string>(type: "character varying(50)", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.RolesName, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RolesName",
                        column: x => x.RolesName,
                        principalSchema: "Filo",
                        principalTable: "Roles",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Filo",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "Filo",
                table: "Permissions",
                column: "Code",
                values: new object[]
                {
                    "file:download",
                    "file:upload",
                    "space:create",
                    "space:read",
                    "space:read.all"
                });

            migrationBuilder.InsertData(
                schema: "Filo",
                table: "Roles",
                column: "Name",
                values: new object[]
                {
                    "Administrator",
                    "Member"
                });

            migrationBuilder.InsertData(
                schema: "Filo",
                table: "RolePermissions",
                columns: new[] { "PermissionsCode", "RoleName" },
                values: new object[,]
                {
                    { "file:download", "Administrator" },
                    { "file:download", "Member" },
                    { "file:upload", "Administrator" },
                    { "file:upload", "Member" },
                    { "space:create", "Administrator" },
                    { "space:create", "Member" },
                    { "space:read", "Administrator" },
                    { "space:read", "Member" },
                    { "space:read.all", "Administrator" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_RoleName",
                schema: "Filo",
                table: "RolePermissions",
                column: "RoleName");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId",
                schema: "Filo",
                table: "UserRoles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_IdentityId",
                schema: "Filo",
                table: "Users",
                column: "IdentityId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsDeleted",
                schema: "Filo",
                table: "Users",
                column: "IsDeleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RolePermissions",
                schema: "Filo");

            migrationBuilder.DropTable(
                name: "UserRoles",
                schema: "Filo");

            migrationBuilder.DropTable(
                name: "Permissions",
                schema: "Filo");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "Filo");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Filo");
        }
    }
}
